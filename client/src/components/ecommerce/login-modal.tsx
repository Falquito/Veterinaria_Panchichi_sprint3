import { useState, useCallback } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// No importamos Button de shadcn, usaremos un <button> estándar y lo estilizaremos
// para mantener el archivo autocontenido.

// ======================
// 🧱 Tipos base
// ======================

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  repeatPassword: string;
}

interface RegisterFormProps {
  onGoToLogin: () => void;
}

// --- MODIFICADO ---
// Añadida la prop onClose
interface LoginStepProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setStep: (step: "email" | "password") => void;
  onGoToRegister: () => void;
  onClose?: () => void; // Prop para cerrar el modal
  saveUser?:(data:any)=>void
}

// ======================
// 🧱 Componente Button (Reemplazo de shadcn)
// ======================
// Para que el componente sea autocontenido, defino un <button> simple
// que acepta las props que estabas usando.

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "outline" | "default";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "default"
}) => {
  // Estilos base
  let baseStyles = "w-full rounded-md py-6 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center";
  
  // Estilos por variante
  if (variant === "outline") {
    baseStyles += " border-2 border-cyan-500 bg-white text-cyan-500 hover:bg-cyan-50 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-white";
  } else {
    // default
    baseStyles += " bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-gray-300 disabled:text-gray-500";
  }
  
  // Estilos para deshabilitado
  if (disabled) {
    baseStyles += " opacity-70 cursor-not-allowed";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
};


// ======================
// 🧱 Input reutilizable
// ======================
interface InputFieldProps {
  label: string;
  id: keyof Omit<RegisterFormData, "repeatPassword" | "password"> | "password" | "repeatPassword";
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (id: keyof RegisterFormData, value: string) => void;
  autoComplete?: string;
  showPassword?: boolean;
  togglePassword?: () => void;
  hasError?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  placeholder = "",
  onChange,
  autoComplete,
  showPassword,
  togglePassword,
  hasError
}) => {
  const isPassword = id === "password" || id === "repeatPassword";
  const inputType = isPassword && !showPassword ? "password" : "text";

  const inputStyle = `w-full border-b-2 ${
    hasError ? "border-red-600" : "border-red-500"
  } bg-transparent px-0 py-2 pr-8 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-cyan-600`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-normal text-cyan-500">
        {label}*
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={isPassword ? inputType : type}
          value={value}
          onChange={(e) => onChange(id as keyof RegisterFormData, e.target.value)}
          className={inputStyle}
          placeholder={placeholder}
          autoComplete={autoComplete || "off"}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={togglePassword}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-red-600 mt-1" aria-live="polite">
          Campo inválido o incompleto
        </p>
      )}
    </div>
  );
};

// ======================
// 🧱 Formulario de registro
// ======================
const RegisterForm: React.FC<RegisterFormProps> = ({ onGoToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (id: keyof RegisterFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [id]: value }));
      if (error) setError(null);
    },
    [error]
  );

  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch = formData.password === formData.repeatPassword;

  const isFormValid =
    formData.nombre.trim() &&
    formData.apellido.trim() &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!isPasswordValid) {
         setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (!doPasswordsMatch) {
         setError("Las contraseñas no coinciden.");
      } else {
         setError("Por favor, completá todos los campos correctamente.");
      }
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      contraseña: formData.password,
    };

    try {
      const response = await fetch('http://localhost:3000/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la cuenta.');
      }

      console.log("Registro exitoso:", await response.json());
      onGoToLogin(); // Redirige a login al éxito

    } catch (err: any) {
      console.error("Error en el registro:", err);
      setError(err.message || "No se pudo conectar al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2 className="mb-2 text-center text-xl font-bold text-cyan-900">Registrarse</h2>
      <p className="mb-6 text-center text-sm text-cyan-500">
        Ingresá tus datos para crear tu cuenta
      </p>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} hasError={!formData.nombre.trim() && !!error} />
        <InputField label="Apellido" id="apellido" value={formData.apellido} onChange={handleInputChange} hasError={!formData.apellido.trim() && !!error} />
      </div>

      <InputField
        label="Email"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        autoComplete="email"
        hasError={!isEmailValid && !!error}
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <InputField
          label="Contraseña"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          autoComplete="new-password"
          hasError={!isPasswordValid && !!error}
        />
        <InputField
          label="Repetir contraseña"
          id="repeatPassword"
          type="password"
          value={formData.repeatPassword}
          onChange={handleInputChange}
          showPassword={showRepeatPassword}
          togglePassword={() => setShowRepeatPassword(!showRepeatPassword)}
          autoComplete="new-password"
          hasError={!doPasswordsMatch && !!error}
        />
      </div>
      
      {error && <p className="text-center text-sm text-red-600 mt-3">{error}</p>}

      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="mt-8 bg-cyan-300 text-gray-700 hover:bg-cyan-500 hover:text-white disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
        {isSubmitting ? "Registrando..." : "Registrarme"}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tenés cuenta?{" "}
        <button type="button" onClick={onGoToLogin} className="font-semibold text-cyan-500 hover:underline">
          Iniciá sesión acá
        </button>
      </div>
    </form>
  )
}

// ======================
// 🧱 Login (paso a paso)
// ======================
const LoginEmailStep: React.FC<LoginStepProps> = ({ email, setEmail, setStep, onGoToRegister }) => (
  <>
    <p className="mb-6 text-center text-sm text-cyan-500">Para comenzar ingresá tu email</p>
    <div className="mb-6">
      <label htmlFor="email" className="mb-2 block text-sm text-cyan-500">Email*</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border-b-2 border-cyan-500 bg-transparent px-0 py-2 text-gray-900 outline-none transition-colors focus:border-red-600"
        autoComplete="email"
      />
    </div>

    <Button
      onClick={() => email && setStep("password")}
      disabled={!email}
      className="mb-3" // Usa estilos por defecto
    >
      Continuar
    </Button>

    <Button
      onClick={onGoToRegister}
      variant="outline"
    >
      Crear cuenta
    </Button>
  </>
)

const LoginPasswordStep: React.FC<LoginStepProps> = ({
  email,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  setEmail,
  setStep,
  onClose,
  saveUser // <-- Prop recibida
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!password) return;

    setIsLoggingIn(true);
    setLoginError(null);

    const payload = {
      email: email.trim(),
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/cliente/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email o contraseña incorrectos.');
      }

      // Éxito
      const data = await response.json();
      console.log("Login exitoso", data);

      saveUser?.(data)
      localStorage.setItem("userId",data.id)
      
      // --- MODIFICADO ---
      // Llamamos a onClose para cerrar el modal
      onClose?.(); 

    } catch (err: any) {
      console.error("Error en el login:", err);
      setLoginError(err.message || "No se pudo conectar al servidor.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-cyan-500">Ahora ingresá la contraseña</p>
      <div className="mb-6 flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2">
        <span className="flex-1 text-sm text-gray-700 truncate">{email}</span>
        <button
          type="button"
          onClick={() => {
            setEmail("")
            setStep("email")
          }}
          className="rounded-full bg-gray-400 p-1 text-white transition-colors hover:bg-gray-500 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="mb-6 relative">
        <label htmlFor="password" className="mb-2 block text-sm text-gray-500">Contraseña*</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 pr-10 text-gray-900 outline-none transition-colors focus:border-cyan-500"
          placeholder="••••••••••"
          autoComplete="current-password"
        />
        <button
          type="button"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-[60%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {loginError && (
        <p className="text-center text-sm text-red-600 mb-4" aria-live="polite">
          {loginError}
        </p>
      )}

      <Button
        onClick={handleLogin}
        disabled={!password || isLoggingIn}
        className="mb-3 bg-cyan-500 hover:bg-cyan-700"
      >
        {isLoggingIn ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
        {isLoggingIn ? "Ingresando..." : "Ingresar"}
      </Button>

      <Button
        variant="outline"
      >
        Obtener mi clave
      </Button>
    </>
  )
}

// ======================
// 🧱 Componente principal
// ======================
export type AuthView = "login" | "password" | "register"

// Añadimos un export default para que pueda ser importado
export default function LoginModal({ onClose ,saveUser}: { onClose?: () => void, saveUser?: () => void  }) {
  const [view, setView] = useState<AuthView>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute right-4 top-4 rounded-full bg-gray-400 p-1.5 text-white transition-colors hover:bg-gray-500"
        >
          <X className="h-4 w-4" />
        </button>

        <AnimatePresence mode="wait">
          {view === "register" ? (
            <motion.div 
              key="register" 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm onGoToLogin={() => setView("login")} />
            </motion.div>
          ) : (
            <motion.div 
              key={view} 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">Iniciar sesión</h2>
              {view === "login" ? (
                <LoginEmailStep
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  setStep={setView as (step: "email" | "password") => void}
                  onGoToRegister={() => setView("register")}
                  onClose={onClose} // <-- Prop pasada aquí
                />
              ) : (
                <LoginPasswordStep
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  setStep={setView as (step: "email" | "password") => void}
                  onGoToRegister={() => setView("register")}
                  onClose={onClose} // <-- Prop pasada aquí
                  saveUser={saveUser}

                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
