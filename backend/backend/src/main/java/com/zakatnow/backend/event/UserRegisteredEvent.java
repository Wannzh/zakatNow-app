package com.zakatnow.backend.event;

import org.springframework.context.ApplicationEvent;

public class UserRegisteredEvent extends ApplicationEvent {
    private final String email;
    private final String fullName;

    public UserRegisteredEvent(Object source, String email, String fullName) {
        super(source);
        this.email = email;
        this.fullName = fullName;
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
}
