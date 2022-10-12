import { Checkbox, Spinner, Text, VStack } from '@chakra-ui/react';
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { abi } from "../abi/TodoList.json";

declare let window: any;

interface Props {
  contractAddress: string,
  currentAccount: string | undefined
}

export const ToDoList = (props: Props) => {
  const { contractAddress, currentAccount } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [taskCount, setTaskCount] = useState<number | undefined>(undefined);
  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = useCallback(async () => {
    if (!window.ethereum) return

    try {
      setIsLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const taskCount = (await contract.taskCount()).toNumber();
      setTaskCount(taskCount);

      const tasks = [];

      for (let i = 0; i < taskCount; i++) {
        const task = await contract.tasks(i)
        tasks.push(task);
      }

      setTasks(tasks);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  const onTaskChange = useCallback(async (index: number) => {

    if (!window.ethereum) return

    try {
      setIsLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const task = tasks[index];
      const response = await contract.toggleCompleted(task[0], { from: currentAccount });
      const receipt = await response.wait();
      console.log({ receipt });

      await loadTasks();
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }

  }, [tasks, contractAddress, currentAccount, loadTasks]);

  useEffect(() => {
    loadTasks().then();
  }, [loadTasks]);

  return (
    <div>
      <Text><b>Contract</b>: {contractAddress}</Text>
      <Text><b>Task count</b>:{taskCount}</Text>
      <VStack>
        {isLoading ? <Spinner /> : <>
          {tasks.map((task, index) => (
            <Checkbox
              key={index}
              isChecked={task.completed}
              onChange={() => onTaskChange(index)}>
              {task.content}
            </Checkbox>
          ))}
        </>}
      </VStack>
    </div>
  )
}