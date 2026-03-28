package com.blog.blogapp.controller;

import com.blog.blogapp.dto.AuthResponse;
import com.blog.blogapp.dto.LoginRequest;
import com.blog.blogapp.dto.RegisterRequest;
import com.blog.blogapp.dto.RegisterResponse;
import com.blog.blogapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
        public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}