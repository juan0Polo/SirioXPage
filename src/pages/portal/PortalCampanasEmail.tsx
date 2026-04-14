import React, { useState, useEffect } from 'react';
import { Upload, Send, Mail, Users, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { api } from '../../lib/api';

interface Campaign {
  id: string;
  nombre: string;
  asunto: string;
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'error';
  total_destinatarios: number;
  enviados: number;
  fallidos: number;
  created_at: string;
}

interface Recipient {
  email: string;
  nombre: string;
  datos?: Record<string, string>;
}

export function PortalCampanasEmail() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    asunto: '',
    contenido: '',
  });
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [previewRecipients, setPreviewRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await api.campanasEmail.list();
      setCampaigns(data as Campaign[]);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExcelFile(file);

    try {
      const XLSX = await import('xlsx');
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      // Skip header row and map to recipients
      const recipients: Recipient[] = jsonData.slice(1).map((row: any[]) => ({
        email: String(row[0] || '').trim(),
        nombre: String(row[1] || '').trim(),
        datos: {
          empresa: String(row[2] || '').trim(),
          cargo: String(row[3] || '').trim(),
          ciudad: String(row[4] || '').trim(),
        },
      })).filter(recipient => recipient.email && recipient.nombre);

      setPreviewRecipients(recipients);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Error al procesar el archivo Excel. Asegúrate de que tenga las columnas: Email, Nombre, Empresa, Cargo, Ciudad');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile || previewRecipients.length === 0) {
      alert('Por favor selecciona un archivo Excel válido con destinatarios');
      return;
    }

    setSending(true);
    try {
      const result = await api.campanasEmail.create({
        ...formData,
        destinatarios: previewRecipients,
      });

      alert(`Campaña creada exitosamente. Enviados: ${result.enviados}, Fallidos: ${result.fallidos}`);
      setShowForm(false);
      setFormData({ nombre: '', asunto: '', contenido: '' });
      setExcelFile(null);
      setPreviewRecipients([]);
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error al crear la campaña');
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'en_progreso':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_progreso':
        return 'En Progreso';
      case 'completado':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas de Email</h1>
          <p className="text-gray-600">Gestiona tus campañas de email masivo con personalización</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Nueva Campaña
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Campaña</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Campaña
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Propuesta de Servicios 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asunto del Email
              </label>
              <input
                type="text"
                required
                value={formData.asunto}
                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Propuesta Personalizada de Servicios - {empresa}"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido del Email
              </label>
              <textarea
                required
                rows={6}
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe el contenido del email. Usa {nombre}, {empresa}, {cargo}, {ciudad} para personalización."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo Excel con Destinatarios
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                El archivo debe tener las columnas: Email, Nombre, Empresa, Cargo, Ciudad
              </p>
            </div>

            {previewRecipients.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">
                  Vista Previa de Destinatarios ({previewRecipients.length})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Email</th>
                        <th className="text-left py-1">Nombre</th>
                        <th className="text-left py-1">Empresa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRecipients.slice(0, 5).map((recipient, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1">{recipient.email}</td>
                          <td className="py-1">{recipient.nombre}</td>
                          <td className="py-1">{recipient.datos?.empresa || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewRecipients.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ... y {previewRecipients.length - 5} más
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={sending || !excelFile}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sending ? 'Enviando...' : 'Enviar Campaña'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Campañas Recientes</h2>
        </div>
        <div className="p-6">
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay campañas creadas aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="group relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Elemento decorativo de Sirio X */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute top-2 right-2 text-blue-600 font-bold text-xs opacity-60">SIRIO X</div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200">
                          {campaign.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">{campaign.asunto}</p>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.estado === 'completado'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : campaign.estado === 'en_progreso'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : campaign.estado === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {getStatusIcon(campaign.estado)}
                          <span className="ml-1">{getStatusText(campaign.estado)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso de envío</span>
                        <span>{Math.round((campaign.enviados / campaign.total_destinatarios) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(campaign.enviados / campaign.total_destinatarios) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{campaign.total_destinatarios}</div>
                        <div className="text-xs text-gray-600">Destinatarios</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-700">{campaign.enviados}</div>
                        <div className="text-xs text-gray-600">Enviados</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mx-auto mb-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-red-700">{campaign.fallidos}</div>
                        <div className="text-xs text-gray-600">Fallidos</div>
                      </div>
                    </div>

                    {/* Footer con fecha y acción */}
                    <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                      <div className="text-xs text-gray-500">
                        <div className="font-medium">Creada el {new Date(campaign.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                        Ver detalles
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
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
}