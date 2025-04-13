'use client';

import { useEffect, useState } from 'react';
import { getAllGroceryLibraryItems } from '@/lib/firebase/services/groceryLibrary';
import { initializeSharedGroceryLibrary } from '@/lib/firebase/groceryLibraryInit';
import { Ingredient } from '@/lib/data/meals';

export default function TestGroceryPage() {
  const [groceryItems, setGroceryItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to initialize the library
        try {
          const initialized = await initializeSharedGroceryLibrary();
          setInitResult(initialized ? 'Successfully initialized the grocery library' : 'Library already exists');
        } catch (initError: any) {
          setInitResult(`Error initializing: ${initError.message}`);
        }

        // Load the items
        try {
          const items = await getAllGroceryLibraryItems();
          setGroceryItems(items);
        } catch (loadError: any) {
          setError(`Error loading items: ${loadError.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleManualInit = async () => {
    try {
      setLoading(true);
      const initialized = await initializeSharedGroceryLibrary();
      setInitResult(initialized ? 'Successfully initialized the grocery library' : 'Library already exists');
      
      // Reload items
      const items = await getAllGroceryLibraryItems();
      setGroceryItems(items);
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await getAllGroceryLibraryItems();
      setGroceryItems(items);
    } catch (error: any) {
      setError(`Error loading items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Grocery Library</h1>
      
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Initialization Status</h2>
        <p>{initResult || 'Initialization not attempted'}</p>
        
        <div className="mt-4 flex gap-2">
          <button 
            onClick={handleManualInit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Working...' : 'Manually Initialize Library'}
          </button>
          
          <button 
            onClick={handleReload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reload Items'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Library Items ({groceryItems.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : groceryItems.length === 0 ? (
          <p>No items found in the grocery library.</p>
        ) : (
          <div className="border rounded divide-y">
            {groceryItems.map((item) => (
              <div key={item.id} className="p-3 hover:bg-gray-50">
                <h3 className="font-medium">{item.name}</h3>
                <div className="text-sm text-gray-500">
                  <p>ID: {item.id}</p>
                  <p>Category: {item.category}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
