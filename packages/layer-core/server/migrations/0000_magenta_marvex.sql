CREATE TABLE `accounts` (
	`access_token` text,
	`expires_at` integer,
	`id` text PRIMARY KEY NOT NULL,
	`profile` text,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`refresh_token` text,
	`scope` text,
	`token_type` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`created_at` text NOT NULL,
	`hashed_password` text,
	`id` text PRIMARY KEY NOT NULL,
	`metadata` text,
	`provider_id` text,
	`provider_user_id` text,
	`type` text NOT NULL,
	`updated_at` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `passkeys` (
	`counter` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`credential_id` text NOT NULL,
	`device` text,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`public_key` text NOT NULL,
	`updated_at` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `passkeys_credential_id_unique` ON `passkeys` (`credential_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`idle_expires_at` text,
	`ip_address` text,
	`refresh_token` text,
	`status` text DEFAULT 'active' NOT NULL,
	`token` text NOT NULL,
	`updated_at` text NOT NULL,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `users` (
	`created_at` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image` text,
	`name` text,
	`role` text DEFAULT 'user' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`type` text NOT NULL
);
