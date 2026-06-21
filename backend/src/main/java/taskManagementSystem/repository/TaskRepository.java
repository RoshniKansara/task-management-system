package taskManagementSystem.repository;

import taskManagementSystem.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import taskManagementSystem.entity.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;


public interface TaskRepository extends JpaRepository<Task, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Task t WHERE t.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    List<Task> findByUser(User user);
    List<Task> findByTitleContainingIgnoreCaseAndUser(
        String keyword,
        User user
    );
    List<Task> findByCompletedAndUser(
        boolean completed,
        User user
    );
    Page<Task> findByUser(
        User user,
        Pageable pageable
    );

    List<Task> findByUser(
        User user,
        Sort sort
    );
}
