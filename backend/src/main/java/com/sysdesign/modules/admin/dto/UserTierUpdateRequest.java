package com.sysdesign.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;

public class UserTierUpdateRequest {

    @NotBlank(message = "Plan tier cannot be blank")
    private String planTier; // FREE, PRO, ENTERPRISE

    public UserTierUpdateRequest() {}

    public UserTierUpdateRequest(String planTier) {
        this.planTier = planTier;
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        this.planTier = planTier;
    }
}
