"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignup } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const { mutate: signup, isPending, error } = useSignup();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ name, email, password, role });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-visible:ring-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-zinc-500"
              />
            </div>
            <div className="space-y-3 pt-2">
              <Label>Account Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "USER" | "ADMIN")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USER" id="r-user" />
                  <Label htmlFor="r-user" className="font-normal cursor-pointer">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ADMIN" id="r-admin" />
                  <Label htmlFor="r-admin" className="font-normal cursor-pointer">Admin</Label>
                </div>
              </RadioGroup>
            </div>
            {error && (
              <div className="text-sm font-medium text-red-500">
                {error.message || "Failed to create account. Please try again."}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign up
            </Button>
            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
