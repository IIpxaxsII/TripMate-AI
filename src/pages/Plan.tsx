import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Users, DollarSign, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Plan = () => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState([2500]);
  const [interests, setInterests] = useState<string[]>([]);

  const interestOptions = [
    "Adventure", "Culture", "Food", "Nature", "Shopping",
    "Nightlife", "Relaxation", "Photography", "History", "Beach"
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">
              {step === 1 && "Basic Details"}
              {step === 2 && "Preferences"}
              {step === 3 && "Review"}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6">
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Where do you want to go?</h2>
                <p className="text-muted-foreground">Tell us about your dream destination</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="e.g., Paris, Tokyo, Bali..."
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 w-4 h-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 w-4 h-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Travelers</Label>
                  <div className="flex items-center gap-4">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{travelers}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTravelers(travelers + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Budget (USD)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        min={500}
                        max={10000}
                        step={100}
                        className="flex-1"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold">${budget[0].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">What are your interests?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover-scale text-sm py-2 px-4"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or preferences?"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Review Your Trip</h2>
                <p className="text-muted-foreground">Everything looks good?</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Destination</span>
                  <span className="font-medium">{destination || "Not set"}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {startDate && endDate
                      ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                      : "Not set"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Travelers</span>
                  <span className="font-medium">{travelers} {travelers === 1 ? "person" : "people"}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <span className="font-medium">${budget[0].toLocaleString()}</span>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-2">Interests</span>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="gap-2">
                Generate Itinerary
              </Button>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Plan;
