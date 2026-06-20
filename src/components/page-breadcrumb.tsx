import React from "react"
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Link } from "@tanstack/react-router"

<PageBreadcrumb
  items={[
    { title: "", to: ""},
    { title: "", to: ""},
    { title: "" },
  ]}

/>

type PageBreadcrumbItem = {
  title: string
  to?: string
}

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[]
}

export default function PageBreadcrumb ({ items }: PageBreadcrumbProps) {
  return (
    <BreadcrumbList>
      {items.map((item, index, arr) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {item.to ? (
              <BreadcrumbLink asChild>
                <Link to={item.to}>{item.title}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {index + 1 < arr.length && (
            <BreadcrumbSeparator />
          )}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  )
}