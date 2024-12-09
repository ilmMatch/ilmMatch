'use client'
import Login from "@/components/login";
import { title } from "@/components/primitives";
import { useAuth } from "@/context/AuthProvider";

export default function BlogPage() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()

  if (!currentUser) {
    return <Login />
  }
  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
}
