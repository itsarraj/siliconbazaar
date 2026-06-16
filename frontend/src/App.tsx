import CartDrawer from "@/components/Cart/CartDrawer";
import Header from "@/components/Navigation/Header";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-950 bg-circuit-grid bg-grid text-slate-100">
        <section className="container py-28">
          <Outlet />
        </section>
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1a2332",
            color: "#f1f5f9",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          },
        }}
      />

      <CartDrawer />
    </>
  );
};

export default App;
