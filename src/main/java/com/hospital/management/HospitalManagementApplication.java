package com.hospital.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.hospital.management.model.User;
import com.hospital.management.model.Role;
import com.hospital.management.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
public class HospitalManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalManagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			Optional<User> adminOptional = userRepository.findByUsername("admin");
			User admin;
			if (adminOptional.isPresent()) {
				admin = adminOptional.get();
			} else {
				admin = new User();
				admin.setUsername("admin");
				admin.setRole(Role.ADMIN);
				admin.setContactInfo("admin@hospital.com");
			}
			// Enforce admin123 password encoding using the guaranteed Spring Encoder context
			admin.setPassword(passwordEncoder.encode("admin123"));
			userRepository.save(admin);
		};
	}
}
