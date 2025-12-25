CREATE TABLE "passkey" (
	"backed_up" boolean NOT NULL,
	"counter" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"device_type" text NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"transports" text,
	"user_id" uuid NOT NULL,
	"webauthn_user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;