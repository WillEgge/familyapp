"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch additional user data from a profiles table if you have one
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
        }
      } else {
        router.push("/signin");
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Error updating profile");
    } else {
      toast.success("Profile updated successfully");
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Profile</h1>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="text" value={user?.email} disabled />
        </div>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
