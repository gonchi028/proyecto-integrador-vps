'use client';

import { cn } from '@/lib/utils';
import { useMesasStore } from '@/store';
import { EllipsisVerticalIcon } from 'lucide-react';

export const Mesas = () => {
  const mesas = useMesasStore((state) => state.mesas);

  return (
    <>
      <h2 className="text-sm font-medium text-gray-500">Mesas</h2>
      <ul
        role="list"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {mesas.map(({ id, numero, estado, capacidad }) => (
          <li key={id} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={cn(
                'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
                estado === 'libre' && 'bg-green-600',
                estado === 'ocupada' && 'bg-pink-600',
                estado === 'reservada' && 'bg-sky-600'
              )}
            >
              # {numero}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a
                  href="#"
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {estado}
                </a>
                <p className="text-gray-500">{capacidad} personas</p>
              </div>
              <div className="shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Más opciones</span>
                  <EllipsisVerticalIcon className='size-6' />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
