package com.drivementor.service;

import com.drivementor.entity.Notification;
import com.drivementor.entity.User;
import com.drivementor.repository.NotificationRepository;
import com.drivementor.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(User user, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public void markAsRead(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
