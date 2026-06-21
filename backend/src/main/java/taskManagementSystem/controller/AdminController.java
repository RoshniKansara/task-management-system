package taskManagementSystem.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import taskManagementSystem.entity.User;
import taskManagementSystem.repository.TaskRepository;
import taskManagementSystem.repository.UserRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    
     @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/test")
    public String adminTest() {
        return "Admin Access Granted";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        taskRepository.deleteByUserId(id);
        userRepository.deleteById(id);
}
}
