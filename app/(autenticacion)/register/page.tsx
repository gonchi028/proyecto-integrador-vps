import { RegisterForm } from './register-form';
import Link from 'next/link';

export default function Register() {
  return (
    <>
      <section className="gradient-form h-screen dark:bg-neutral-700 flex items-center justify-center p-4">
        <div className="max-w-5xl">
          <div className="flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full">
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <div className="g-0 lg:flex lg:flex-wrap">
                  {/* <!-- Left column container--> */}
                  <div className="px-4 md:px-0 lg:w-6/12">
                    <div className="md:mx-6 md:p-12">
                      {/* <!--Logo--> */}
                      <div className="text-center">
                        <img
                          className="mx-auto w-48"
                          src="https://previews.123rf.com/images/maxutov/maxutov1710/maxutov171000042/87944028-cocinar-el-restaurante-cocinero-ilustraci%C3%B3n-de-vector-aislado-en-un-fondo-blanco.jpg"
                          alt="logo"
                        />
                        <h4 className="mt-1 pb-1 text-2xl font-semibold">
                          Restaurante Terrasse
                        </h4>
                        <p className="mb-12 text-sm">Crea tu cuenta</p>
                      </div>

                      <RegisterForm />

                      <div className="mt-6 text-center text-sm">
                        <span>¿Ya tienes una cuenta? </span>
                        <Link
                          href="/login"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Inicia sesión aquí
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Right column container with background and description--> */}
                  <div
                    className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-e-lg lg:rounded-bl-none"
                    style={{
                      background:
                        'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)',
                    }}
                  >
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-xl font-semibold">
                        Únete a nuestra familia
                      </h4>
                      <p className="text-sm">
                        Crea tu cuenta y disfruta de una experiencia gastronómica 
                        única. Accede a nuestro menú completo, realiza pedidos y 
                        forma parte de la comunidad Terrasse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 
