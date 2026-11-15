package com.sysdesign.modules.auth.service;

import com.sysdesign.common.exception.BadRequestException;
import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.common.security.JwtTokenProvider;
import com.sysdesign.modules.auth.dto.*;
import com.sysdesign.modules.user.model.Role;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.model.UserProfile;
import com.sysdesign.modules.user.repository.RoleRepository;
import com.sysdesign.modules.user.repository.UserProfileRepository;
import com.sysdesign.modules.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.email().toLowerCase().trim(),
                passwordEncoder.encode(request.password()),
                request.fullName().trim()
        );

        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER", "Standard User")));
        user.setRoles(Collections.singleton(defaultRole));

        User savedUser = userRepository.save(user);

        UserProfile profile = new UserProfile(savedUser);
        userProfileRepository.save(profile);
        savedUser.setProfile(profile);

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

        return new AuthResponse(token, refreshToken, toUserDto(savedUser, profile));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password())
        );

        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(token, refreshToken, toUserDto(user, profile));
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.refreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        UUID userId = tokenProvider.getUserIdFromToken(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(token, newRefreshToken, toUserDto(user, profile));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user));
        return toUserDto(user, profile);
    }

    public static UserDto toUserDto(User user, UserProfile profile) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                roles,
                profile != null ? profile.getTargetRole() : "Senior Software Engineer",
                profile != null ? profile.getExperienceYears() : 3,
                profile != null ? profile.getTargetCompanies() : new String[]{"Google", "Amazon"},
                profile != null ? profile.getPreferredLevel() : "INTERMEDIATE",
                profile != null ? profile.getInterviewReadinessScore() : java.math.BigDecimal.ZERO,
                profile != null ? profile.getDailyStreak() : 0
        );
    }
}
