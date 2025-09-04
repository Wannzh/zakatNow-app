package com.zakatnow.backend.event;

import org.springframework.context.ApplicationEvent;

public class UserUpgradeRoleEvent extends ApplicationEvent {
    private final String email;
    private final String fullName;

    public UserUpgradeRoleEvent(Object source, String email, String fullName) {
        super(source);
        this.email = email;
        this.fullName = fullName;
    }

    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
}
