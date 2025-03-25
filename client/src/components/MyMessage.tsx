interface messageProps {
  message: string
}

export default function MyMessage(props: messageProps) {
  return (
    <>
      <div className="inline-flex max-w-[65%] self-end">
        <span className="bg-white text-black rounded-md px-4 py-2">
          <span>{ props.message }</span>
        </span>
      </div>
    </>
  )
}
