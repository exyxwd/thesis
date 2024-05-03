package hu.exyxwd.tisztatisza.security;

import java.util.*;
import jakarta.servlet.*;
import java.io.IOException;
import jakarta.servlet.http.*;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;

import org.springframework.http.*;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.fasterxml.jackson.databind.ObjectMapper;

import hu.exyxwd.tisztatisza.model.User;

@Component
@AllArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper mapper;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        Map<String, Object> errorDetails = new HashMap<>();

        try {
            String accessToken = jwtUtil.resolveToken(request);
            if (accessToken == null) {
                filterChain.doFilter(request, response);
                return;
            }

            Claims claims = jwtUtil.getClaimsFromToken(accessToken);
            if (claims == null || !jwtUtil.validateClaims(claims)) {
                filterChain.doFilter(request, response);
                return;
            }

            String username = claims.getSubject();
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = new User(username, "");
            String newToken = jwtUtil.createToken(user);
    
            response.setHeader(HttpHeaders.SET_COOKIE, "token=" + newToken + "; Path=/api; HttpOnly; SameSite=Strict");
        } catch (Exception e) {
            errorDetails.put("message", "Authentication Error");
            errorDetails.put("details", e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(response.getWriter(), errorDetails);
            return;
        }
        filterChain.doFilter(request, response);
    }
}