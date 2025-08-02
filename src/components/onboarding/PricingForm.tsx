import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface PricingFormProps {
  data: {
    hourly_rate: number;
    minimum_fee: number;
    equipment_provided: boolean;
    travel_distance: string;
  };
  onChange: (data: Partial<any>) => void;
}

const travelOptions = [
  { value: 'local', label: 'Solo mi ciudad' },
  { value: 'regional', label: 'Hasta 50km' },
  { value: 'provincial', label: 'Toda la provincia' },
  { value: 'national', label: 'Nacional' },
  { value: 'international', label: 'Internacional' }
];

export const PricingForm: React.FC<PricingFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hourly_rate">Tarifa por hora (€)</Label>
          <div className="space-y-2">
            <Slider
              value={[data.hourly_rate]}
              onValueChange={(value) => onChange({ hourly_rate: value[0] })}
              max={500}
              min={20}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>20€</span>
              <span className="font-medium">{data.hourly_rate}€/hora</span>
              <span>500€+</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Precio orientativo por hora de actuación
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum_fee">Tarifa mínima por evento (€)</Label>
          <Input
            id="minimum_fee"
            type="number"
            value={data.minimum_fee}
            onChange={(e) => onChange({ minimum_fee: parseInt(e.target.value) || 0 })}
            placeholder="200"
            min="0"
          />
          <p className="text-sm text-muted-foreground">
            El precio mínimo que aceptas por cualquier actuación
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="equipment_provided">¿Proporcionas equipo de sonido?</Label>
            <p className="text-sm text-muted-foreground">
              Incluye micrófonos, amplificadores, altavoces
            </p>
          </div>
          <Switch
            id="equipment_provided"
            checked={data.equipment_provided}
            onCheckedChange={(checked) => onChange({ equipment_provided: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travel_distance">Disposición para viajar</Label>
          <Select value={data.travel_distance} onValueChange={(value) => onChange({ travel_distance: value })}>
            <SelectTrigger>
              <SelectValue placeholder="¿Hasta dónde viajas?" />
            </SelectTrigger>
            <SelectContent>
              {travelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 p-4 border border-border rounded-lg bg-accent/20">
        <h4 className="font-medium mb-2">💰 Consejos de Precios</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Investiga precios de artistas similares en tu zona</li>
          <li>• Considera costos de transporte y montaje</li>
          <li>• Ofrece descuentos por eventos largos o múltiples fechas</li>
          <li>• Siempre puedes ajustar precios después del registro</li>
        </ul>
      </div>
    </div>
  );
};