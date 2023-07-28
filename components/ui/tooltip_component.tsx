import React, { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export default function ToolTipComponent({children, content}: {children: ReactNode, content: string}) {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  
  )
}
