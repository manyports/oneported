
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, UserIcon, BuildingIcon, HandshakeIcon } from 'lucide-react'

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
            <h1 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text"
            >
              Соединяем волонтеров и организации
            </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Платформа, где энтузиасты находят возможности, а организации - надежных помощников.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input className="max-w-lg flex-1" placeholder="Поиск возможностей или волонтеров..." type="text" />
                <Button type="submit" className="w-full sm:w-auto">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Поиск
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-[#131313]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Как это работает</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                  Наша платформа упрощает процесс поиска волонтеров и волонтерских возможностей.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 items-start lg:grid-cols-3">
              {[
                { title: "Для волонтеров", icon: UserIcon, description: "Создайте профиль, укажите свои навыки и интересы, и находите подходящие возможности для волонтерства." },
                { title: "Для организаций", icon: BuildingIcon, description: "Размещайте объявления о волонтерских вакансиях и находите энтузиастов, готовых помочь вашему делу." },
                { title: "Соединяем", icon: HandshakeIcon, description: "Наш алгоритм подбирает идеальные совпадения между волонтерами и организациями." },
              ].map((item, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center justify-between">
                    <item.icon className="h-12 w-12 mb-4" />
                    <CardDescription className="text-center">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Присоединяйтесь сегодня</h2>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Станьте частью нашего сообщества и начните менять мир к лучшему.
                </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2">
                <Input placeholder="Ваш email" type="email" />
                <Button type="submit" className="w-full">Зарегистрироваться</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  )
}