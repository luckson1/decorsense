
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ToolTipComponent from '@/components/ui/tooltip_component'
import { cn, rooms, themeType, themes } from '@/lib/utils'

import { Room, Theme } from '@prisma/client'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { CheckIcon, LucideDownload } from 'lucide-react'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'

export default function Client({restoredImages}: {restoredImages: {
  room: Room;
  id: string;
  theme: Theme;
  imageUrl: string;
}[] | null}) {

const [roomType, setRoomType]=useState<Room | undefined>()
const [themeType, setThemeType]=useState<Theme| undefined>()

const images=useMemo(()=> {
if(roomType && themeType) {
  return restoredImages?.filter(image=> image.room===roomType).filter(image=>image.theme===themeType)
}

if(roomType && !themeType)  {
 return restoredImages?.filter(image=> image.room===roomType)
}

if ( themeType && !roomType ) {
  return  restoredImages?.filter(image=>image.theme===themeType)
} else {
  return  restoredImages
}
}, [restoredImages, roomType, themeType])

  return (
    <div className="flex justify-between  w-full  flex-col space-x-8 ">
    <div className="w-full mx-auto  flex justify-center flex-row items-center  p-5">
    <Popover >
            <PopoverTrigger asChild>
            
                <Button
                size={'lg'}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full max-w-xs justify-between mx-3 md:mx-5",
                    roomType && "text-muted-foreground"
                  )}
                >
                  {roomType
                    ? roomType.replace(/_/g, ' ').replace(/^\w/, (match) => match.toUpperCase())
                    : "Filter by room"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Filter by room..."
                  className="h-9"
                />
                <CommandEmpty>No Rooms </CommandEmpty>
                <CommandGroup>
                  {rooms.map((room) => (
                    <CommandItem
                      value={room}
                      key={room}
                      // @ts-expect-error 
                      onSelect={(value:Room) => {
              setRoomType(value)
          
                      }
                    }
                    >
                      {room}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                         room.toLocaleLowerCase()===roomType
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
            
                <Button
                size={'lg'}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full max-w-xs justify-between mx-3 md:mx-5",
                    themeType && "text-muted-foreground"
                  )}
                >
                  {themeType
                    ? themeType.replace(/_/g, ' ').replace(/^\w/, (match) => match.toUpperCase())
                    : "Filter by theme"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search themes..."
                  className="h-9"
                />
                <CommandEmpty>No Themes </CommandEmpty>
                <CommandGroup>
                  {themes.map((theme) => (
                    <CommandItem
                      value={theme.theme}
                      key={theme.theme}
                    
                      onSelect={(value) => {
                          // @ts-expect-error 
              setThemeType(value.replace(/^\w/, (match) => match.toUpperCase()))
         console.log(themeType)
                      }
                    }
                    >
                      {theme.theme}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                         theme.theme===themeType
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
    </div>
       
        <div className="w-full  space-y-4">
   

<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-start  p-5">
{images &&
images.map(image=> (
<div key={image.id} className="w-full flex flex-col space-y-4 space-x-4">

<Card className="h-64 w-full max-w-xs mt-7 " key={image.id} >
<CardContent className="w-full h-full flex flex-col justify-center items-center relative">
<Image src={image.imageUrl} alt="room"  fill className="rounded-lg"/>
<ToolTipComponent content="Change image" >
<Button size={'icon'} className="absolute top-5" 

>
<LucideDownload />
</Button>
</ToolTipComponent>
</CardContent>
</Card>
<p className="tracking-widest font-medium text-lg">{image.theme}</p>
</div>
))
}
</div>
   </div>
    </div>
  )
}
