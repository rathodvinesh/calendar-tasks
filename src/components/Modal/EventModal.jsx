import React from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function EventModal({
  show,
  onHide,
  data,
  onChange,
  onSave,
  onDelete,
}) {
  return (
    <Transition show={show} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onHide}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {data.id ? "Edit Event" : "Add Event"}
              </Dialog.Title>
              <div className="mt-2">
                <form>
                  <label className="block">
                    Title
                    <input
                      type="text"
                      className="w-full mt-1 border-gray-300 rounded-md"
                      value={data.title}
                      onChange={(e) => onChange("title", e.target.value)}
                      placeholder="Enter event title"
                    />
                  </label>
                  <label className="block mt-2">
                    Start Time
                    <input
                      type="datetime-local"
                      className="w-full mt-1 border-gray-300 rounded-md"
                      value={
                        data.start
                          ? new Date(data.start).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        onChange("start", new Date(e.target.value))
                      }
                    />
                  </label>
                  <label className="block mt-2">
                    End Time
                    <input
                      type="datetime-local"
                      className="w-full mt-1 border-gray-300 rounded-md"
                      value={
                        data.end
                          ? new Date(data.end).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        onChange("end", new Date(e.target.value))
                      }
                    />
                  </label>
                  <label className="block mt-2">
                    Description
                    <textarea
                      className="w-full mt-1 border-gray-300 rounded-md"
                      value={data.desc}
                      onChange={(e) => onChange("desc", e.target.value)}
                      placeholder="Enter event description"
                    />
                  </label>
                </form>
              </div>
              <div className="mt-4 flex justify-between">
                {data.id && (
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-md"
                    onClick={() => onDelete(data.id)}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md"
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md"
                  onClick={onSave}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
