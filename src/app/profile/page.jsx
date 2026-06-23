"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MyProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [updating, setUpdating] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const name = e.target.name.value;
    const image = e.target.image.value;

    const { data, error } = await authClient.updateUser({
      name,
      image,
    });

    setUpdating(false);

    if (error) {
      toast.error(error.message || "Failed to update profile.");
      return;
    }

    toast.success("Profile updated successfully.");
    router.refresh();
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`text-left px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === "profile"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`text-left px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === "orders"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                Orders
              </button>
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-sm transition-colors mt-4"
              >
                Log out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-foreground mb-1">Profile</h2>
                  <p className="text-sm text-muted-foreground">Update your personal information.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-border">
                    <img
                      src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input
                        required
                        name="name"
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-foreground focus:ring-0 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-border rounded-sm bg-secondary text-muted-foreground text-sm cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wide">Avatar URL</label>
                      <input
                        name="image"
                        type="url"
                        defaultValue={user.image || ""}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-3 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:border-foreground focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-foreground text-background font-medium text-sm px-6 py-2 rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-foreground mb-1">Orders</h2>
                  <p className="text-sm text-muted-foreground">View your order history.</p>
                </div>
                <div className="border border-border rounded-sm p-8 text-center text-muted-foreground text-sm">
                  You  placed any orders yet.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;