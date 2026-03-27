import { useState, useEffect } from 'react';
import { Evenement, CreateEvenementDto, UpdateEvenementDto } from '../types/event.types';
import ImageUpload from './ImageUpload';

interface EventModalProps {
  isOpen: boolean;
  event?: Evenement;
  onClose: () => void;
  onSave: (data: CreateEvenementDto | UpdateEvenementDto) => Promise<void>;
  isLoading?: boolean;
}

export default function EventModal({ isOpen, event, onClose, onSave, isLoading }: EventModalProps) {
  const [formData, setFormData] = useState<CreateEvenementDto>({
    titreEvent: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    image: '',
    nbPlace: 0,
    typeEvent: undefined,
    adresse: undefined,
    tarif: undefined,
    organisateur: undefined
  });
  const [error, setError] = useState('');

  // Initialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    console.log('🔄 EventModal - Initialisation, event:', event);
    
    if (event) {
      // Mode édition : pré-remplir avec les données existantes
      const formattedData: CreateEvenementDto = {
        titreEvent: event.titreEvent || '',
        description: event.description || '',
        dateDebut: event.dateDebut ? formatDateForInput(event.dateDebut) : '',
        dateFin: event.dateFin ? formatDateForInput(event.dateFin) : '',
        image: event.image || '',
        nbPlace: event.nbPlace || 0,
        typeEvent: event.typeEvent,
        adresse: event.adresse,
        tarif: event.tarif,
        organisateur: event.organisateur
      };
      
      console.log('📝 Mode édition, données:', formattedData);
      setFormData(formattedData);
    } else {
      // Mode création : formulaire vide
      const emptyData: CreateEvenementDto = {
        titreEvent: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        image: '',
        nbPlace: 0,
        typeEvent: undefined,
        adresse: undefined,
        tarif: undefined,
        organisateur: undefined
      };
      
      console.log('✨ Mode création, formulaire vide');
      setFormData(emptyData);
    }
    
    setError('');
  }, [event, isOpen]);

  // Formater une date ISO en format datetime-local (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (isoDate: string): string => {
    try {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nbPlace') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Gérer le changement d'image 
  // ⚠️ IMPORTANT : reçoit le FILENAME uniquement, pas l'URL
  const handleImageChange = (imageFilename: string) => {
    console.log('📝 EventModal - Image changée, filename reçu:', imageFilename);
    setFormData((prev) => ({
      ...prev,
      image: imageFilename, // On stocke seulement le filename
    }));
  };

  // Gérer la suppression d'image
  const handleImageDelete = () => {
    console.log('🗑️ EventModal - Image supprimée');
    setFormData((prev) => ({
      ...prev,
      image: '', // Réinitialiser le champ image
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation minimale
    if (!formData.titreEvent.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (!formData.dateDebut) {
      setError('La date de début est obligatoire');
      return;
    }

    console.log('💾 EventModal - Sauvegarde, données à envoyer:', formData);

    try {
      // Envoyer au parent (qui va appeler l'API)
      await onSave(formData);
      
      console.log('✅ Sauvegarde réussie');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement';
      console.error('❌ Erreur sauvegarde:', errorMessage);
      setError(errorMessage);
    }
  };

  // Ne rien afficher si le modal est fermé
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header du modal */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Modifier l\'événement' : 'Créer un événement'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            disabled={isLoading}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Message d'erreur global */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Composant d'upload d'image */}
          <ImageUpload
            currentImage={formData.image}
            onImageChange={handleImageChange}
            onImageDelete={handleImageDelete}
            disabled={isLoading}
          />

          {/* Champ Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titreEvent"
              value={formData.titreEvent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Festival de Jazz International"
              disabled={isLoading}
              required
            />
          </div>

          {/* Champ Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Décrivez votre événement..."
              disabled={isLoading}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="datetime-local"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Nombre de places */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de places
            </label>
            <input
              type="number"
              name="nbPlace"
              value={formData.nbPlace}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}