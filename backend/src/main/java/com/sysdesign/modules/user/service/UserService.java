package com.sysdesign.modules.user.service;

import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.modules.auth.dto.UserDto;
import com.sysdesign.modules.auth.service.AuthService;
import com.sysdesign.modules.user.dto.UpdateProfileRequest;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.model.UserProfile;
import com.sysdesign.modules.user.repository.UserProfileRepository;
import com.sysdesign.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
            userRepository.save(user);
        }

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile(user);
                    return userProfileRepository.save(newProfile);
                });

        if (request.targetRole() != null) {
            profile.setTargetRole(request.targetRole());
        }
        if (request.experienceYears() != null) {
            profile.setExperienceYears(request.experienceYears());
        }
        if (request.targetCompanies() != null) {
            profile.setTargetCompanies(request.targetCompanies());
        }
        if (request.preferredLevel() != null) {
            profile.setPreferredLevel(request.preferredLevel());
        }

        userProfileRepository.save(profile);

        return AuthService.toUserDto(user, profile);
    }
}
