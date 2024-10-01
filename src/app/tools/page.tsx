import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Code,
  FileCode,
  FileJson,
  Palette,
  Table,
  Table2Icon,
} from "lucide-react";
import Link from "next/link";
import path from "path";

const technologies = [
  {
    name: "Трассировочные таблицы",
    icon: Table2Icon,
    description:
      "Создайте свою трассировочную таблицу и сделайте экспорт в PDF за считанные клики!",
    path: "/tools/table",
  },
];

export default function Component() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Утилиты:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {technologies.map((tech) => (
          <Card
            key={tech.name}
            className="flex flex-col min-h-[320px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <tech.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">{tech.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <CardDescription className="mb-6 flex-grow">
                {tech.description}
              </CardDescription>
              <Link href={tech.path || ""} className="mt-auto">
                <Button className="w-full">
                  Попробовать сейчас!
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
