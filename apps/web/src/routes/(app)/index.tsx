import { createFileRoute } from '@tanstack/react-router'
import type { Recipe } from '@cookware/lexicons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, data } = useQuery({
    queryKey: ['recipes:all'],
    queryFn: async () => {
      const res = await fetch(`https://api.dev.hayden.moe/recipes`);
      return await res.json() as { recipes: (Recipe & { rkey: string })[] };
    },
  });

  console.log(data);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Community
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Browse Recipes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {data && data.recipes.map(v => (
          <Card key={v.rkey}>
            <CardHeader>
              <CardTitle>{v.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{v.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
