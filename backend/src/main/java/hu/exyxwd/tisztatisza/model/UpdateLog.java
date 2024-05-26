package hu.exyxwd.tisztatisza.model;

import lombok.*;

import java.time.LocalDateTime;

import jakarta.persistence.*;

/** Entity for database update logs. */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "update_logs")
public class UpdateLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime updateTime;

    private Integer updateCount;

    private Integer deleteCount;

    private Long totalCount;
}