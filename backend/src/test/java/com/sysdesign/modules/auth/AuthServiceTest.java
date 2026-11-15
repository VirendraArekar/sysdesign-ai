package com.sysdesign.modules.auth;

import com.sysdesign.common.exception.BadRequestException;
import com.sysdesign.common.security.JwtTokenProvider;
import com.sysdesign.modules.auth.dto.AuthResponse;
import com.sysdesign.modules.auth.dto.RegisterRequest;
import com.sysdesign.modules.auth.service.AuthService;
import com.sysdesign.modules.user.model.Role;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.repository.RoleRepository;
import com.sysdesign.modules.user.repository.UserProfileRepository;
import com.sysdesign.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                roleRepository,
                userProfileRepository,
                passwordEncoder,
                authenticationManager,
                tokenProvider
        );
    }

    @Test
    void registerNewUserSuccess() {
        RegisterRequest request = new RegisterRequest("john@example.com", "secretPassword", "John Doe");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(new Role("ROLE_USER", "Standard")));

        User mockUser = new User(request.email(), "hashedPassword", request.fullName());
        mockUser.setId(UUID.randomUUID());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(tokenProvider.generateToken(any(), any())).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("mock-refresh-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.token());
        assertEquals("john@example.com", response.user().email());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest("existing@example.com", "secretPassword", "Existing User");
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }
}
