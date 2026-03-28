package com.blog.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private boolean success;
    private String message;
    private String email;

    public RegisterResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.email = null;
    }
}
