import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Pencil, DollarSign, Clock, Package, Check, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { RFP } from '../types';
import { createRFP, updateRFP } from '../services/api';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

const CreateRFP = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedRFP, setGeneratedRFP] = useState<RFP | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please describe your procurement needs');
      return;
    }

    setGenerating(true);
    try {
      const rfp = await createRFP(input);
      setGeneratedRFP(rfp);
      toast.success('RFP generated successfully!');
    } catch (error) {
      toast.error('Failed to generate RFP');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedRFP) return;
    
    setSaving(true);
    try {
      await updateRFP(generatedRFP.id, generatedRFP);
      toast.success('RFP saved successfully!');
      navigate(`/rfps/${generatedRFP.id}`);
    } catch (error) {
      toast.error('Failed to save RFP');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedRFP(null);
    setEditing(false);
  };

  const updateField = (field: keyof RFP, value: unknown) => {
    if (!generatedRFP) return;
    setGeneratedRFP({ ...generatedRFP, [field]: value });
  };

  return (
    <Layout>
      <PageHeader
        title="Create New RFP"
        description="Describe your procurement needs in natural language"
      />

      {!generatedRFP ? (
        <div className="max-w-3xl animate-slide-up">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">AI-Powered RFP Generation</span>
                </div>
                
                <Textarea
                  placeholder="Example: I need 20 laptops with 16GB RAM and 10 monitors. Budget is $30,000. Need delivery in 30 days."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[180px] resize-none text-base"
                  disabled={generating}
                />

                <Button
                  onClick={handleGenerate}
                  disabled={generating || !input.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI is processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate RFP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h3 className="text-sm font-medium text-foreground mb-2">Tips for best results:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific about quantities and specifications</li>
              <li>• Include your budget constraints</li>
              <li>• Mention delivery timeline requirements</li>
              <li>• Specify any warranty or payment term preferences</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">RFP Generated Successfully</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-2">
                <Pencil className="w-4 h-4" />
                {editing ? 'Done Editing' : 'Edit Fields'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Title & Description */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">RFP Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  {editing ? (
                    <Input
                      value={generatedRFP.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="mt-1.5"
                    />
                  ) : (
                    <p className="text-foreground mt-1">{generatedRFP.title}</p>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  {editing ? (
                    <Textarea
                      value={generatedRFP.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="mt-1.5"
                    />
                  ) : (
                    <p className="text-muted-foreground mt-1">{generatedRFP.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Budget & Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label>Budget</Label>
                      {editing ? (
                        <Input
                          type="number"
                          value={generatedRFP.budget}
                          onChange={(e) => updateField('budget', parseInt(e.target.value))}
                          className="mt-1 w-40"
                        />
                      ) : (
                        <p className="text-2xl font-semibold text-foreground">
                          ${generatedRFP.budget.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label>Delivery Timeline</Label>
                      {editing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            value={generatedRFP.deliveryDays}
                            onChange={(e) => updateField('deliveryDays', parseInt(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-muted-foreground">days</span>
                        </div>
                      ) : (
                        <p className="text-2xl font-semibold text-foreground">
                          {generatedRFP.deliveryDays} days
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Items */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {generatedRFP.items.map((item, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-sm bg-muted px-2 py-1 rounded">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.specs}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Payment Terms</Label>
                  {editing ? (
                    <Input
                      value={generatedRFP.paymentTerms}
                      onChange={(e) => updateField('paymentTerms', e.target.value)}
                      className="mt-1.5"
                    />
                  ) : (
                    <p className="text-muted-foreground mt-1">{generatedRFP.paymentTerms}</p>
                  )}
                </div>
                <div>
                  <Label>Warranty</Label>
                  {editing ? (
                    <Input
                      value={generatedRFP.warranty}
                      onChange={(e) => updateField('warranty', e.target.value)}
                      className="mt-1.5"
                    />
                  ) : (
                    <p className="text-muted-foreground mt-1">{generatedRFP.warranty}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save RFP'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateRFP;
