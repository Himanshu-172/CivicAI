import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PlaceholderPage } from "../pages/placeholder-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlaceholderPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

