package taskManagementSystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import taskManagementSystem.entity.Task;
import taskManagementSystem.entity.User;
import taskManagementSystem.repository.TaskRepository;
import taskManagementSystem.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public Task createTask(Task task) {
        User user = getCurrentUser();

        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> GetAllTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUser(user);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TAsk not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task updateTask(Long id, Task updatedTask) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setCompleted(updatedTask.getCompleted());
        task.setDueDate(updatedTask.getDueDate());
        task.setCategory(updatedTask.getCategory());

        return taskRepository.save(task);
    }

    private User getCurrentUser() {

        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();
            System.out.println("AUTH = " + authentication);
            if(authentication != null) {
                System.out.println("NAME = " + authentication.getName());
            }
        String email = authentication.getName();
        System.out.println("EMAIL FROM TOKEN = " + email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Task> searchTasks(String keyword) {

    User user = getCurrentUser();

    return taskRepository
            .findByTitleContainingIgnoreCaseAndUser(
                    keyword,
                    user
            );

    }

    public List<Task> filterTasks(boolean completed) {

        User user = getCurrentUser();

        return taskRepository.findByCompletedAndUser(
                completed,
                user
        );
    }
    public Page<Task> getTasksPaginated(
        int page,
        int size
    ) {

        User user = getCurrentUser();

        Pageable pageable =
                PageRequest.of(page, size);

        return taskRepository
                .findByUser(user, pageable);
    }

    public List<Task> getTasksSorted(String direction) {

        User user = getCurrentUser();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by("title").descending()
                : Sort.by("title").ascending();

        return taskRepository.findByUser(user, sort);
    }

}
