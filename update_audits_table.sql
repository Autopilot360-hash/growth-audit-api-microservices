-- Ajouter la colonne url manquante
ALTER TABLE audits ADD COLUMN IF NOT EXISTS url TEXT;

-- Renommer 'type' en 'audit_type' 
ALTER TABLE audits RENAME COLUMN type TO audit_type;

-- Mettre à jour les valeurs par défaut pour correspondre au nouveau code
ALTER TABLE audits ALTER COLUMN audit_type SET DEFAULT 'growth';
ALTER TABLE audits ALTER COLUMN status SET DEFAULT 'pending';

-- Ajouter des contraintes
ALTER TABLE audits ALTER COLUMN url SET NOT NULL;

-- Vérifier la nouvelle structure
\d audits;
