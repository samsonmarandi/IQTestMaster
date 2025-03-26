import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EDUCATION_LEVELS, QUIZ_CONSTANTS } from "@/lib/constants";
import { userInfoSchema, type UserInfo } from "@shared/schema";

interface WelcomeScreenProps {
  onStartTest: (userInfo: UserInfo) => void;
}

export function WelcomeScreen({ onStartTest }: WelcomeScreenProps) {
  const form = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: "",
      age: undefined,
      educationLevel: undefined,
    },
  });

  function onSubmit(values: UserInfo) {
    onStartTest(values);
  }

  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-8">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-800">IQ Assessment Test</h1>
        <p className="text-gray-600 mb-6 text-center">Test your cognitive abilities with our comprehensive IQ assessment</p>
        
        <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6 rounded">
          <h2 className="font-medium text-lg text-gray-800 mb-2">About this test</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>30 questions across different cognitive areas</li>
            <li>Each question has a 60-second time limit</li>
            <li>You cannot return to previous questions</li>
            <li>Test takes approximately 25-30 minutes to complete</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium text-lg text-gray-800 mb-2">Question Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary">Logical Reasoning</h3>
              <p className="text-sm text-gray-600">Analyze patterns and solve logical problems</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary">Mathematical Ability</h3>
              <p className="text-sm text-gray-600">Solve number problems and sequences</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary">Pattern Recognition</h3>
              <p className="text-sm text-gray-600">Identify patterns in visual sequences</p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter your age"
                      min={QUIZ_CONSTANTS.MIN_AGE} 
                      max={QUIZ_CONSTANTS.MAX_AGE}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Education Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select your highest education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Start Test
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
