/**
 * v0 by Vercel Labs.
 * @see https://v0.dev/t/Yudwvib
 */
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { Button } from "@/components/ui/Button"

export default function Component() {
  return (
    <Card key="1" className="w-full max-w-lg">
      <CardHeader className="border-b border-dark-gray-300 pb-4">
        <div className="flex items-center">
          <svg
            className=" mr-2"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
          <CardTitle>Cookie Preferences</CardTitle>
        </div>
        <CardDescription>
          Manage your cookie settings. You can enable or disable different types of cookies below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex justify-between items-start space-y-2">
          <div>
            <Label htmlFor="essential">Essential Cookies</Label>
            <p className="text-dark-gray-500 text-sm">
              These cookies are necessary for the website to function and cannot be switched off.
            </p>
          </div>
          <Switch className="ml-auto" id="essential" />
        </div>
        <div className="flex justify-between items-start space-y-2">
          <div>
            <Label htmlFor="analytics">Analytics Cookies</Label>
            <p className="text-dark-gray-500 text-sm">
              These cookies allow us to count visits and traffic sources, so we can measure and improve the performance
              of our site.
            </p>
          </div>
          <Switch className="ml-auto" id="analytics" />
        </div>
        <div className="flex justify-between items-start space-y-2">
          <div>
            <Label htmlFor="marketing">Marketing Cookies</Label>
            <p className="text-dark-gray-500 text-sm">These cookies help us show you relevant ads.</p>
          </div>
          <Switch className="ml-auto" id="marketing" />
        </div>
      </CardContent>
      <div className="border-t border-dark-gray-300 mt-4" />
      <CardFooter>
        <Button className="ml-auto" type="submit">
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
