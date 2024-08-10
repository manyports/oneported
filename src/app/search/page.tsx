"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhoneIcon, MapPinIcon, ClockIcon, UserIcon } from 'lucide-react'

const volunteerPlaces = [
  { id: 1, name: "Городской парк", time: "10:00 - 14:00", phone: "+7 (123) 456-7890", address: "ул. Центральная, 1", city: "Москва" },
  { id: 2, name: "Приют для животных", time: "09:00 - 18:00", phone: "+7 (987) 654-3210", address: "ул. Лесная, 5", city: "Санкт-Петербург" },
]

const volunteers = [
  { id: 1, name: "Анна Иванова", age: 25, phone: "+7 (111) 222-3333" },
  { id: 2, name: "Петр Сидоров", age: 30, phone: "+7 (444) 555-6666" },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [revealedInfo, setRevealedInfo] = useState<number[]>([])

  const toggleReveal = (id: number) => {
    setRevealedInfo(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filterItems = (items: any[], term: string) => {
    return items.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    )
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Поиск волонтеров и мест для волонтерства</h1>
      
      <Tabs defaultValue="places" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="places">Места</TabsTrigger>
          <TabsTrigger value="volunteers">Волонтеры</TabsTrigger>
        </TabsList>
        
        <div className="my-4">
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value="places">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterItems(volunteerPlaces, searchTerm).map(place => (
              <Card key={place.id}>
                <CardHeader>
                  <CardTitle>{place.name}</CardTitle>
                  <CardDescription>
                    <ClockIcon className="inline mr-2" size={16} />
                    {place.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {revealedInfo.includes(place.id) && (
                    <>
                      <p><PhoneIcon className="inline mr-2" size={16} />{place.phone}</p>
                      <p><MapPinIcon className="inline mr-2" size={16} />{place.address}, {place.city}</p>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toggleReveal(place.id)}>
                    {revealedInfo.includes(place.id) ? "Скрыть информацию" : "Показать контакты"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volunteers">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterItems(volunteers, searchTerm).map(volunteer => (
              <Card key={volunteer.id}>
                <CardHeader>
                  <CardTitle>{volunteer.name}</CardTitle>
                  <CardDescription>
                    <UserIcon className="inline mr-2" size={16} />
                    Возраст: {volunteer.age}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {revealedInfo.includes(volunteer.id) && (
                    <p><PhoneIcon className="inline mr-2" size={16} />{volunteer.phone}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toggleReveal(volunteer.id)}>
                    {revealedInfo.includes(volunteer.id) ? "Скрыть номер" : "Показать номер"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}