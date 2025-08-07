import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center pt-20 sm:pt-10 md:pt-0 md:justify-center min-h-screen bg-white px-6 text-center text-gray-800">
      <img
        src="/not-found.png" // Assurez-vous que cette image existe
        alt="Page non trouvée"
        className="w-36 md:w-80 mb-6 animate-pulse"
      />

      <h1 className="text-5xl font-bold mb-2">404</h1>
      <p className="text-xl font-medium mb-3">
        Oups ! Cette page n’existe pas.
      </p>
      <p className="text-base mb-6 text-gray-600">
        Nous sommes désolés, la page que vous recherchez est introuvable.
      </p>

      <p className="text-sm text-gray-500 mb-6">
        Redirection vers la page d’accueil dans 5 secondes...
      </p>

      <button
        onClick={() => navigate("/")}
        className="rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-white hover:border hover:border-primary hover:text-primary focus:outline-none cursor-pointer  transition-colors duration-500 "
      >
        Retour à l’accueil
      </button>
    </div>
  );
};

export default NotFound;
