package hu.exyxwd.tisztatisza.security;

import io.jsonwebtoken.*;
import javax.crypto.SecretKey;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;

import java.util.Date;
import java.security.Key;
import java.util.concurrent.TimeUnit;

import hu.exyxwd.tisztatisza.model.User;

/* The JwtUtil class contains the util functions for creating and validating JWT tokens. */
@Component
public class JwtUtil {
    // The validity of the access token in minutes
    private long accessTokenValidity = 60;

    private final JwtParser jwtParser;
    private final Key key;

    public JwtUtil(){
        this.key = Jwts.SIG.HS256.key().build();
        this.jwtParser = Jwts.parser().verifyWith((SecretKey) key).build();
    }

    /**
     * Create a JWT token for the user.
     *
     * @param user The user to create the token for.
     * @return The JWT token.
     */
    public String createToken(User user) {
        Date tokenCreateTime = new Date();
        Date tokenValidity = new Date(tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(accessTokenValidity));
        return Jwts.builder()
                .subject(user.getUsername())
                .expiration(tokenValidity)
                .signWith(key)
                .compact();
    }

    /**
     * Resolve the token from the cookies in the request.
     *
     * @param request The request to resolve the token from.
     * @return The token from the request.
     */
    public String resolveToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * Validate the token claims by checking it's expiry.
     *
     * @param claims The claims to validate.
     * @return True if the claims are valid, false otherwise.
     */
    public boolean validateClaims(Claims claims) throws AuthenticationException {
        try {
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            throw e;
        }
    }

    public String getUsername(Claims claims) {
        return claims.getSubject();
    }

    public Claims getClaimsFromToken(String token) {
        try {
            return jwtParser.parseSignedClaims(token).getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}