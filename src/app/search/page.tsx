"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

interface VolunteerPlace {
  id: number;
  name: string;
  time: string;
  phone: string;
  address: string;
  city: string;
}

interface Volunteer {
  id: number;
  name: string;
  age: number;
  phone: string;
}

const volunteerPlaces: VolunteerPlace[] = [
  {
    id: 1,
    name: "Mega Center Alma-Ata",
    time: "10:00 - 14:00",
    phone: "+7 (123) 456-7890",
    address: "ул. Розыбакиева 274А",
    city: "Алматы",
  },
  {
    id: 2,
    name: "Приют для животных",
    time: "09:00 - 18:00",
    phone: "+7 (987) 654-3210",
    address: "ул. Туран, 5",
    city: "Астана",
  },
  {
    id: 3,
    name: "Dostyk Plaza",
    time: "11:00 - 20:00",
    phone: "+7 (727) 344-4434",
    address: "пр. Достык, 111",
    city: "Алматы",
  },
  {
    id: 4,
    name: "Астана Арена",
    time: "15:00 - 22:00",
    phone: "+7 (717) 272-7272",
    address: "пр. Туран, 47",
    city: "Астана",
  },
  {
    id: 5,
    name: "Ботанический сад Алматы",
    time: "08:00 - 19:00",
    phone: "+7 (727) 377-2525",
    address: "ул. Тимофеева, 36",
    city: "Алматы",
  },
  {
    id: 6,
    name: "Mega Silk Way",
    time: "10:00 - 22:00",
    phone: "+7 (717) 232-3434",
    address: "ул. Қабанбай Батыра, 62",
    city: "Астана",
  },
  {
    id: 7,
    name: "Парк Первого Президента",
    time: "06:00 - 23:00",
    phone: "+7 (727) 355-5353",
    address: "пр. Аль-Фараби, 1",
    city: "Алматы",
  },
  {
    id: 8,
    name: "Театр Астана Опера",
    time: "14:00 - 21:00",
    phone: "+7 (717) 270-9090",
    address: "пр. Туран, 1",
    city: "Астана",
  },
  {
    id: 9,
    name: "Esentai Mall",
    time: "10:00 - 22:00",
    phone: "+7 (727) 244-4444",
    address: "пр. Аль-Фараби, 77/8",
    city: "Алматы",
  },
  {
    id: 10,
    name: "Жетысу Парк",
    time: "07:00 - 22:00",
    phone: "+7 (727) 352-5252",
    address: "ул. Абая, 53",
    city: "Алматы",
  },
  {
    id: 11,
    name: "Bayterek Tower",
    time: "09:00 - 21:00",
    phone: "+7 (717) 257-5757",
    address: "пр. Нұржол, 14",
    city: "Астана",
  },
  {
    id: 12,
    name: "KazMedia Center",
    time: "08:00 - 18:00",
    phone: "+7 (717) 293-9393",
    address: "ул. Қонаев, 4",
    city: "Астана",
  },
];

const volunteers: Volunteer[] = [
  { id: 1, name: "Ерасыл Базарбаев", age: 16, phone: "+7 (111) 222-3333" },
  { id: 2, name: "Алимжан Жорабек", age: 16, phone: "+7 (444) 555-6666" },
  { id: 3, name: "Сериков Айжас", age: 16, phone: "+7 (777) 888-9999" },
  { id: 4, name: "Аружан Нурбек", age: 16, phone: "+7 (101) 202-3030" },
  { id: 5, name: "Бекзат Жанибек", age: 17, phone: "+7 (404) 505-6060" },
  { id: 6, name: "Мадина Абишева", age: 16, phone: "+7 (707) 808-9090" },
  { id: 7, name: "Данияр Сейтжан", age: 17, phone: "+7 (111) 212-3131" },
  { id: 8, name: "Алина Еркебуланова", age: 16, phone: "+7 (414) 515-6161" },
  { id: 9, name: "Айдар Садвокасов", age: 16, phone: "+7 (717) 818-9191" },
  { id: 10, name: "Диана Мухтарова", age: 17, phone: "+7 (121) 323-4343" },
  { id: 11, name: "Ермек Амангельды", age: 16, phone: "+7 (424) 525-6363" },
  { id: 12, name: "Зарина Кайратова", age: 17, phone: "+7 (727) 828-9393" },
  { id: 13, name: "Руслан Ибраев", age: 16, phone: "+7 (131) 343-5454" },
  {
    id: 14,
    name: "Айгерим Тлеубергенова",
    age: 17,
    phone: "+7 (434) 545-6565",
  },
  { id: 15, name: "Мурат Сулейменов", age: 16, phone: "+7 (737) 848-9595" },
];

function SearchPageContent() {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [revealedInfo, setRevealedInfo] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const q = searchParams.get('q');
      if (q) {
        setSearchTerm(q);
      }
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
  
      return () => clearTimeout(timer);
    }, [searchParams]);
  
    const toggleReveal = (id: number) => {
      setRevealedInfo((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };
  
    const filterItems = <T extends Record<string, any>>(items: T[], term: string): T[] => {
      return items.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      );
    };

  const PlaceSkeleton: React.FC = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  const VolunteerSkeleton: React.FC = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  const renderContent = <T extends Record<string, any>>(
    items: T[],
    ItemComponent: React.FC<T>
  ) => {
    const filteredItems = filterItems(items, searchTerm);

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg font-semibold text-gray-600">
            По вашему запросу ничего не найдено.
          </p>
          <p className="text-sm text-gray-500">
            Попробуйте изменить параметры поиска.
          </p>
        </div>
      );
    }

    return filteredItems.map((item) => (
      <ItemComponent key={item.id} {...item} />
    ));
  };

  const PlaceCard: React.FC<VolunteerPlace> = (place) => (
    <Card>
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
        <CardDescription>
          <ClockIcon className="inline mr-2" size={16} />
          {place.time}
          <br />
          <MapPinIcon className="inline mr-2" size={16} />
          {place.address}, {place.city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {revealedInfo.includes(place.id) && (
          <p>
            <PhoneIcon className="inline mr-2" size={16} />
            {place.phone}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => toggleReveal(place.id)}>
          {revealedInfo.includes(place.id)
            ? "Скрыть информацию"
            : "Показать контакты"}
        </Button>
      </CardFooter>
    </Card>
  );

  const VolunteerCard: React.FC<Volunteer> = (volunteer) => (
    <Card>
      <CardHeader>
        <CardTitle>{volunteer.name}</CardTitle>
        <CardDescription>
          <UserIcon className="inline mr-2" size={16} />
          Возраст: {volunteer.age}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {revealedInfo.includes(volunteer.id) && (
          <p>
            <PhoneIcon className="inline mr-2" size={16} />
            {volunteer.phone}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => toggleReveal(volunteer.id)}>
          {revealedInfo.includes(volunteer.id)
            ? "Скрыть номер"
            : "Показать номер"}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Поиск волонтеров и мест для волонтерства
        </h1>
        <Tabs defaultValue="places" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="places">Места</TabsTrigger>
            <TabsTrigger value="volunteers">Волонтеры</TabsTrigger>
          </TabsList>

          <div className="my-4">
            <Input
              type="text"
              placeholder="Введите что-угодно для поиска, например 'Алматы', 'Базарбаев Ерасыл' и прочее"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <TabsContent value="places">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array(9)
                    .fill(0)
                    .map((_, index) => <PlaceSkeleton key={index} />)
                : renderContent(volunteerPlaces, PlaceCard)}
            </div>
          </TabsContent>

          <TabsContent value="volunteers">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => <VolunteerSkeleton key={index} />)
                : renderContent(volunteers, VolunteerCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}