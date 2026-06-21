package taskManagementSystem.entity;

import java.time.LocalDate;
import jakarta.persistence.*;  //imports JPA annotations
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")


public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String priority;

    private Boolean completed;

    private LocalDate dueDate;

    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
