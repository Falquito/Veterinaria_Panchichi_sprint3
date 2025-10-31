import React, { useState, useEffect } from 'react';
import { Search, Package, X, DollarSign, Warehouse } from 'lucide-react';
import { getProducts } from '../services/productService';
import type { Product } from '../types/product';

interface ProductSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  selectedProductId?: number;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedProductId
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  useEffect(() => {
    const filtered = products.filter(product => {
      const categoriaString = typeof product.categoria === 'string' 
        ? product.categoria 
        : product.categoria?.nombre || '';
      
      return product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoriaString.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts();
      // Solo mostrar productos activos
      setProducts(productsData.filter(p => p.activo !== false));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product: Product) => {
    onSelect(product);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 fixed inset-0 backdrop-blur-sm bg-white/10 transition-all duration-300 z-50 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Seleccionar Producto</h3>
              <p className="text-sm text-gray-500">
                {filteredProducts.length} productos disponibles
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o categoría..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                    ${selectedProductId === product.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {product.imagen ? (
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 truncate pr-2">
                          {product.nombre}
                        </h4>
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${product.estado?.color || 'bg-gray-100 text-gray-700'}
                        `}>
                          {product.estado?.label || 'Activo'}
                        </span>
                      </div>
                      
                      {product.descripcion && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.descripcion}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>${product.precio?.toLocaleString('es-AR') || '0'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Warehouse className="w-4 h-4 mr-1" />
                          <span>Stock: {product.stock || 0}</span>
                        </div>
                      </div>
                      
                      {(() => {
                        const categoriaString = typeof product.categoria === 'string' 
                          ? product.categoria 
                          : product.categoria?.nombre || '';
                        
                        return categoriaString && categoriaString !== '—' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {categoriaString}
                            </span>
                          </div>
                        );
                      })()}
                      
                      {product.depositos && product.depositos.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Depósitos: {product.depositos.map(d => d.nombreDeposito).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};