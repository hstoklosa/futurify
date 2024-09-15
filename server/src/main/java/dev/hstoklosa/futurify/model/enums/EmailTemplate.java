package dev.hstoklosa.futurify.model.enums;

public enum EmailTemplate {

    ACTIVATE_ACCOUNT("activate_account");

    private final String name;

    EmailTemplate(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
