package taskManagementSystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import taskManagementSystem.entity.Task;
import taskManagementSystem.service.TaskService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskservice;

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskservice.createTask(task);
    }

    @GetMapping 
    public List<Task> getAllTasks() {
        return taskservice.GetAllTasks();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskservice.getTaskById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskservice.deleteTask(id);
        return "Task deleted successfully";
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                            @RequestBody Task updatedTask) {

        return taskservice.updateTask(id, updatedTask);
    }
    @GetMapping("/search")
    public List<Task> searchTasks(
        @RequestParam String keyword
    ) {
        return taskservice.searchTasks(keyword);
    }

    @GetMapping("/filter")
    public List<Task> filterTasks(
            @RequestParam boolean completed
    ) {
        return taskservice.filterTasks(completed);
    }

    @GetMapping("/paginated")
    public Page<Task> getTasksPaginated(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return taskservice.getTasksPaginated(
                page,
                size
        );
    }

    @GetMapping("/sorted")
    public List<Task> getTasksSorted(
            @RequestParam String direction
    ) {
        return taskservice.getTasksSorted(direction);
    }
}
