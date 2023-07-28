"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Footer from "../../components/Footer";
import ResizablePanel from "../../components/ResizablePanel";;
import {  roomType, themeType, rooms, themes, cn } from "../../lib/utils";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {CheckIcon,  MoveRight, Trash } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorMessage } from "@hookform/error-message";
import ToolTipComponent from "@/components/ui/tooltip_component";

// Configuration for the uploader
const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});

const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      // primary: "hsl(var(--primary))", // Primary buttons & links
      error: "hsl(var(--destructive))", // Error messages
      shade100: "#fff", // Standard text
      shade200: "#fffe", // Secondary button text
      shade300: "#fffd", // Secondary button text (hover)
      shade400: "#fffc", // Welcome text
      shade500: "#fff9", // Modal close button
      shade600: "hsl(var(--border))", // Border
      shade700: "#fff2", // Progress indicator background
      shade800: "#fff1", // File item background
      shade900: "#ffff", // Various (draggable crop buttons, etc.)
    },
  },
};

export default function DreamPage() {
  const [restoredImages, setRestoredImages] = useState<{theme:themeType, url:string}[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
const roomSchema=z.object({imageUrl:z.string(), room:z.enum([  'living_room'
, 'dining_room'
, 'bedroom'
, 'bathroom'
, 'office'
, 'gaming_room']).refine((val)=> val===  'dining_room'
||'bedroom'
||'bathroom'
||'office'
||'gamin_room', {
  message: "You have to select at least one room item.",
}),
themes: z.array(z.enum([   'Modern'
, 'Traditional'
, 'Contemporary'
, 'Farmhouse'
, 'Rustic'
,"MidCentury"
,"Mediterranean"
,"Industrial"
,"Scandinavian"])).refine((value) => value.some((theme) => theme), {
  message: "You have to select at least one theme.",
}),
})
type RoomValues=z.infer<typeof roomSchema>
const {setValue, formState: {errors}, handleSubmit, control,resetField,  watch}=useForm<RoomValues>({
  resolver: zodResolver(roomSchema),
})

const roomThemes=watch('themes')

const originalImage=watch('imageUrl')

async function generatePhotos({imageUrl, themes, room}:{imageUrl: string, themes: themeType[], room: roomType}) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  setLoading(true)

Promise.all(
   themes.map(async(theme)=> {
  
    setLoading(true);
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl, theme, room }),
    });
   
    let newPhoto = await res.json() as string;      
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      const newRestoredImages= restoredImages? [...restoredImages, {theme, url: newPhoto}]: [{theme, url: newPhoto}]
     
     
      setRestoredImages(newRestoredImages)
    }
    setTimeout(() => {
      setLoading(false);
    }, 1300);
   })
  )
}

  return (
    
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
  
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between  w-full lg:flex-row flex-col mt-4">
          
                <form className="w-full flex justify-center flex-col items-center lg:w-1/3 p-5" onSubmit={handleSubmit((data)=> generatePhotos(data))}>
               
                <div className="space-y-4 w-full max-w-sm flex flex-col">
            {!originalImage &&  <>
              <Label className="w-full max-w-xs text-start">Upload a picture of your home</Label>
              <Controller
          name='imageUrl'
          
          control={control}

          render={({field})=> (
            <UploadDropzone
 
            uploader={uploader}
            options={options}
            onUpdate={(file) => {
              if (file.length !== 0) {
                setPhotoName(file[0].originalFile.originalFileName);
                setValue('imageUrl', file[0].fileUrl.replace("raw", "thumbnail"));
                field.onChange(file[0].fileUrl.replace("raw", "thumbnail"))
                // generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
              }
            }}
            width="320px"
            height="320px"
          />
         
          )}/>
            <ErrorMessage
                  errors={errors}
                  name='imageUrl'
                  as="h5"
                  className="text-red-600"
                />
              </>}
              {!!originalImage &&  <Card className="h-[20rem] w-full max-w-xs max-h-full m-5" >
    <CardContent className="w-full h-full flex justify-center items-center flex-col relative">
     <Image src={originalImage} alt="room" fill className="rounded-lg"/>
     <ToolTipComponent content="Change image" >
  <Button size={'icon'} className="absolute top-5" onClick={()=>resetField('imageUrl')}>
  <Trash />
  </Button>
  </ToolTipComponent>
    </CardContent>
  </Card>}
                  </div>
            
                  <div className="space-y-4 w-full max-w-sm flex flex-col">
                  
                
              <Label className="w-full max-w-xs text-start">Room type</Label>
          <Controller
          name="room"
          
          control={control}

          render={({field})=> (
            <Popover>
            <PopoverTrigger asChild>
            
                <Button
                size={'lg'}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full max-w-xs justify-between",
                    field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? field.value.replace(/_/g, ' ').replace(/^\w/, (match) => match.toUpperCase())
                    : "Select room theme"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandEmpty>No Rooms </CommandEmpty>
                <CommandGroup>
                  {rooms.map((room) => (
                    <CommandItem
                      value={room}
                      key={room}
                      // @ts-expect-error 
                      onSelect={(value:roomType) => {
                  setValue('room', value)
                      }
                    }
                    >
                      {room}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                         room.toLocaleLowerCase()===field.value
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
          )}/>
             <ErrorMessage
                  errors={errors}
                  name='room'
                  as="h5"
                  className="text-red-600"
                />
             
        
                  </div>
                  <div className="space-y-4 w-full max-w-sm flex flex-col mt-4">
                  <Label className="w-full max-w-xs text-start">Select Design theme (maximum of 4)</Label>
             
                    <div className="w-full h-fit grid grid-cols-3">
                    {themes.map((t) => (
  <div className="mb-4 relative" key={t.theme}>
    <label htmlFor={t.theme} className="cursor-pointer">
      <Image src={t.url} alt={t.theme} width={90} height={90} className="w-24 h-24 rounded-md" />
      <div className="w-full text-xs text-start mt-2">{t.theme}</div>
    </label>

    <Controller
      name="themes"
      control={control}
      render={({ field }) => (
        <Checkbox
          id={t.theme}
          checked={field.value?.includes(t.theme)}
          className="absolute top-3 right-10"
          onCheckedChange={(checked) => {
            if (Array.isArray(field.value)) {
              const maxAllowedSelections = 4;

              if (checked) {
                if (field.value.length < maxAllowedSelections) {
                  field.onChange([...field.value, t.theme]);
                }
              } else {
                field.onChange(field.value.filter((value) => value !== t.theme));
              }
            } else {
              field.onChange(checked ? [t.theme] : []);
            }
          }}
        />
      )}
    />
       <ErrorMessage
                  errors={errors}
                  name='themes'
                  as="h5"
                  className="text-red-600"
                />
  </div>
))}


                      </div>
             
                    
                  </div>
              <div className="w-full flex justify-start"> 
         
            <Button className="mt-5 w-full max-w-xs" size={'lg'} role="submit" >
                   {loading? "Loading....": " Get Ideas"}
                  </Button>
                  
        
            
              </div>
               
                </form>
                <div className="w-full lg:w-2/3 space-y-4">
                <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal  sm:text-6xl mb-5">
          Generate your <span className="text-blue-600">dream</span> room
        </h1>
        {/* <p>  <span>Uploading a photo <MoveRight /></span> <span>2. Specify the room</span> <span>3. Select room themes</span> <span>4. Click Submit</span></p> */}
        <div className="w-full flex flex-row space-x-3">
          <p>Uploading a photo</p>
          <MoveRight className="w-6 h-6" />
          <p>Specify the room</p>
          <MoveRight className="w-6 h-6" />
          <p> Select room themes</p>
          <MoveRight className="w-6 h-6" />
          <p>Click submit button</p>
        </div>
           <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-center items-start  p-5">
       
{!roomThemes && !restoredImages &&
  <Card className="h-72 w-full max-w-[22rem] mt-7 " >
    <CardContent className="w-full h-full flex justify-center items-center flex-col">
     <Image src='/room.png' alt="room" width={50} height={50}/>
     <p className="tracking-widest font-medium text-lg">No Theme selected</p>
    </CardContent>
  </Card>
}
{roomThemes && !restoredImages &&
roomThemes.map(theme=> (
  <Card className="h-72 w-full max-w-[22rem] mt-7 " key={theme} >
  <CardContent className="w-full h-full flex flex-col justify-center items-center">
   <Image src='/room.png' alt="room" width={50} height={50}/>
   <p className="tracking-widest font-medium text-lg">{theme}</p>
  </CardContent>
</Card>
))
}
{restoredImages &&
restoredImages.map(restoredImage=> (
<div key={restoredImage.theme} className="w-full flex flex-col space-y-4">

<Card className="h-72 w-full max-w-[22rem] mt-7 " key={restoredImage.theme} >
  <CardContent className="w-full h-full flex flex-col justify-center items-center relative">
   <Image src={restoredImage.url} alt="room"  fill className="rounded-lg"/>
 
  </CardContent>
</Card>
<p className="tracking-widest font-medium text-lg">{restoredImage.theme}</p>
</div>
))
}
           </div>
           </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
}
