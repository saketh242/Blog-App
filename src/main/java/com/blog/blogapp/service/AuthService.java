package com.blog.blogapp.service;

import com.blog.blogapp.dto.AuthResponse;
import com.blog.blogapp.dto.LoginRequest;
import com.blog.blogapp.dto.RegisterRequest;
import com.blog.blogapp.dto.RegisterResponse;
import com.blog.blogapp.entity.User;
import com.blog.blogapp.repository.UserRepository;
import com.blog.blogapp.security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RegisterResponse register(RegisterRequest request) {
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new RegisterResponse(false, "Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();

        userRepository.save(user);
        return new RegisterResponse(true, "User registered successfully", request.getEmail());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}