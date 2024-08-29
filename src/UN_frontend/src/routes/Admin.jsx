import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./admin.css";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  StackDivider,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CourseCard from "../components/admin/courseCard";
import { UN_backend } from "../../../declarations/UN_backend";
import useActorLoader from "../hooks/useActorLoader";
import {
  CourseStatus,
  CourseStatuses,
  getEnum,
  ResourceType,
  ResourceTypes,
} from "../helper/enum";
import { parseValues } from "../helper/parser";
import { IoAddCircle } from "react-icons/io5";
import ResourceCard from "../components/admin/resourseCard";
import { FaPlus } from "react-icons/fa";
import { createBackendActor, createClient } from "../helper/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiTrash } from "react-icons/fi";
import { Principal } from "@dfinity/principal";
import withAuth from "../lib/withAuth";

const Admin = () => {
  const Pages = {
    courses: 1,
    courseDetail: 2,
    permissions: 3,
    questions: 4,
  };
  const toast = useToast();

  const [selectedPage, setSelectedPage] = useState(Pages.courses);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [courseResources, setCourseResources] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState(""); // Input for new owner
  const [selectedCourse, setSelectCourse] = useState(null);
  const [owner, setOwner] = useState("");
  const [addingNewAdmin, setAddingNewAdmin] = useState(false);

  const fetcher = useCallback(async () => {
    const response = await UN_backend.listCourses();
    const owner = await UN_backend.getOwner();
    const admins = await UN_backend.getAcls();
    setCourses(await parseValues(response));
    setOwner(owner.toText());
    setAdmins(admins.map((item) => item.toText()));
  });

  const fetchQuestions = useCallback(async () => {
    const response = await UN_backend.getCourseQuestions(
      BigInt(selectedCourse.id)
    );
    if (response.err) {
      toast({
        title: "Failed to get course questions",
        position: "top",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    const list = await parseValues(response.ok);
    setQuestions(list);
  }, [selectedCourse]);

  const fetchResources = useCallback(async () => {
    const response = await UN_backend.getCourseDetails(
      BigInt(selectedCourse.id)
    );
    if (response.err) {
      toast({
        title: "Failed to get course resources",
        position: "top",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    const list = await parseValues(response.ok.resources);
    console.log(list);
    setCourseResources(list);
  }, [selectedCourse]);

  const { isLoading } = useActorLoader(fetcher);

  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();

  // Handle adding a new admin
  const handleAddAdmin = async () => {
    if (newAdmin) {
      let newPrincipal = null;
      try {
        newPrincipal = Principal.fromText(newAdmin)
      } catch(e) {
        toast({
          title: "Invalid principal",
          position: "top",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
        setNewAdmin("");
        return;
      }
      try {
        setAddingNewAdmin(true);
        const response = await UN_backend.addAcls(newPrincipal);
        setAdmins([...admins, newAdmin]);
        setNewAdmin(""); // Clear the input field after adding
      } catch (e) {
        console.error(e)
        toast({
          title: "Failed to add principal",
          position: "top",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      } finally {
        setAddingNewAdmin(false);
      }
    }
  };

  useEffect(() => {
    // Update url with page
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", selectedPage); // update the 'page' param with the new value
    const newSearch = queryParams.toString();
    const newUrl = `${location.pathname}?${newSearch}`;
    window.history.pushState({}, "", newUrl);
  }, [selectedPage]);

  // Handle deleting an admin
  const handleDeleteAdmin = async (principal) => {
    const response = await UN_backend.removeAcls(principal);
    if (response.ok === null) {
      const admins = await UN_backend.getAcls();
      setAdmins(admins.map((item) => item.toText()));
    } else {
      toast({
        title: "Failed to remove admin",
        position: "top",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const {
    isOpen: isOpenResource,
    onOpen: onOpenResource,
    onClose: onCloseResource,
  } = useDisclosure();
  const {
    isOpen: isOpenQuestion,
    onOpen: onOpenQuestion,
    onClose: onCloseQuestion,
  } = useDisclosure();

  const courseFormik = useFormik({
    initialValues: {
      title: "",
      summary: "",
      status: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      summary: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const authClient = await createClient();
        const actor = await createBackendActor(authClient.getIdentity());
        const response = await actor.updateCourse(
          BigInt(selectedCourse.id),
          values.title,
          values.summary,
          CourseStatus[values.status]
        );
        if (response.ok) {
          toast({
            title: "Course updated successfully",
            isClosable: true,
            position: "top",
            duration: 3000,
            status: "success",
          });
          await fetcher();
        } else {
          toast({
            title: "Error updating course",
            description: response.err,
            isClosable: true,
            position: "top",
            duration: 3000,
            status: "error",
          });
        }
      } catch (e) {
        toast({
          title: "Error updating course",
          description: "We are looking into the issue now",
          isClosable: true,
          position: "top",
          duration: 3000,
          status: "error",
        });
        throw e;
      }
    },
  });

  useEffect(() => {
    if (selectedCourse) {
      fetchQuestions();
      fetchResources();
      courseFormik.setFieldValue("title", selectedCourse.title);
      courseFormik.setFieldValue("summary", selectedCourse.summary);
      courseFormik.setFieldValue(
        "status",
        getEnum(selectedCourse.status, CourseStatus)
      );
    }
  }, [selectedCourse]);

  const resourceFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      url: "",
      rType: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      url: Yup.string().url().required("Required"),
      rType: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const authClient = await createClient();
        const actor = await createBackendActor(authClient.getIdentity());
        const response = await actor.createResource(
          BigInt(selectedCourse.id),
          values.title,
          values.description,
          values.url,
          ResourceType[values.rType]
        );
        if (response.ok) {
          toast({
            title: "Resource created successfully",
            isClosable: true,
            position: "top",
            duration: 3000,
            status: "success",
          });
          setCourseResources((prev) => {
            return [
              ...prev,
              {
                title: values.title,
                description: values.description,
                url: values.url,
                rType: ResourceType[values.rType],
              },
            ];
          });
          resetForm();
          onCloseResource();
        } else {
          toast({
            title: "Error creating resource",
            description: response.err,
            isClosable: true,
            position: "top",
            duration: 3000,
            status: "error",
          });
        }
      } catch (e) {
        toast({
          title: "Error creating resource",
          description: "We are looking into the issue now",
          isClosable: true,
          position: "top",
          duration: 3000,
          status: "error",
        });
        throw e;
      }
    },
  });

  const renderContent = () => {
    switch (selectedPage) {
      case Pages.courses:
        return (
          <div>
            <h2>Courses</h2>

            <Flex gap={6}>
              {courses.map((item, idx) => {
                return (
                  <CourseCard
                    key={idx}
                    course={item}
                    onSelect={() => {
                      setSelectCourse(item);
                      setSelectedPage(Pages.courseDetail);
                    }}
                  />
                );
              })}
            </Flex>
          </div>
        );

      case Pages.courseDetail:
        return (
          <div>
            <h2>Courses - {selectedCourse.title}</h2>

            <form onSubmit={courseFormik.handleSubmit}>
              <Stack spacing={6}>
                <HStack spacing={6} align={"start"}>
                  <FormControl isInvalid={courseFormik.errors.title}>
                    <FormLabel>Course Title</FormLabel>
                    <Input
                      type="text"
                      placeholder="Course Title"
                      name="title"
                      value={courseFormik.values.title}
                      onChange={courseFormik.handleChange}
                      onBlur={courseFormik.handleBlur}
                    />
                    <FormErrorMessage>
                      {courseFormik.errors.title}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={courseFormik.errors.status}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      placeholder="Select course status"
                      value={courseFormik.values.status}
                      onChange={courseFormik.handleChange}
                      onBlur={courseFormik.handleBlur}
                    >
                      {CourseStatuses.map((item, idx) => {
                        return (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </Select>
                    <FormErrorMessage>
                      {courseFormik.errors.status}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <FormControl isInvalid={courseFormik.errors.summary}>
                  <FormLabel>Course Summary</FormLabel>
                  <Textarea
                    rows={8}
                    name="summary"
                    value={courseFormik.values.summary}
                    onChange={courseFormik.handleChange}
                    onBlur={courseFormik.handleBlur}
                  />
                  <FormErrorMessage>
                    {courseFormik.errors.summary}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              <Flex justify={"flex-end"}>
                <Button
                  type="submit"
                  isLoading={courseFormik.isSubmitting}
                  mt={6}
                  display={"block"}
                >
                  Update
                </Button>
              </Flex>
            </form>

            <Tabs>
              <TabList>
                <Tab>Resources</Tab>
                <Tab>Questions</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <HStack align={"center"} justify={"space-between"} mb={2}>
                    <Heading size={"md"} mb={0}>
                      Resources
                    </Heading>
                    <IconButton
                      onClick={onOpenResource}
                      colorScheme={"blue"}
                      icon={<IoAddCircle />}
                    />
                  </HStack>
                  <Flex gap={4} wrap={"wrap"} align={"stretch"}>
                    {courseResources.map((item, idx) => {
                      return <ResourceCard resource={item} key={idx} />;
                    })}
                  </Flex>
                  <Modal isOpen={isOpenResource} onClose={onCloseResource}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Create new resource</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form onSubmit={resourceFormik.handleSubmit}>
                          <Stack gap={6}>
                            <FormControl
                              isInvalid={resourceFormik.errors.title}
                            >
                              <FormLabel>Title</FormLabel>
                              <Input
                                placeholder="Resource title"
                                name="title"
                                value={resourceFormik.values.title}
                                onChange={resourceFormik.handleChange}
                                onBlur={resourceFormik.handleBlur}
                              />
                              <FormErrorMessage>
                                {resourceFormik.errors.title}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={resourceFormik.errors.url}>
                              <FormLabel>Url</FormLabel>
                              <Input
                                placeholder="Resource url"
                                name="url"
                                value={resourceFormik.values.url}
                                onChange={resourceFormik.handleChange}
                                onBlur={resourceFormik.handleBlur}
                              />
                              <FormErrorMessage>
                                {resourceFormik.errors.url}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              isInvalid={resourceFormik.errors.description}
                            >
                              <FormLabel>Description</FormLabel>
                              <Textarea
                                placeholder="Enter resource description"
                                name="description"
                                value={resourceFormik.values.description}
                                onChange={resourceFormik.handleChange}
                                onBlur={resourceFormik.handleBlur}
                              />
                              <FormErrorMessage>
                                {resourceFormik.errors.description}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Type</FormLabel>
                              <Select
                                name="type"
                                placeholder="Select resource type"
                                value={resourceFormik.values.rType}
                                onChange={resourceFormik.handleChange}
                                onBlur={resourceFormik.handleBlur}
                              >
                                {ResourceTypes.map((item, idx) => {
                                  return (
                                    <option key={idx} value={item}>
                                      {item}
                                    </option>
                                  );
                                })}
                              </Select>
                              <FormErrorMessage>
                                {resourceFormik.errors.rType}
                              </FormErrorMessage>
                            </FormControl>
                          </Stack>
                        </form>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          variant="ghost"
                          mr={3}
                          onClick={onCloseResource}
                        >
                          Close
                        </Button>
                        <Button
                          colorScheme="blue"
                          isLoading={resourceFormik.isSubmitting}
                          onClick={resourceFormik.submitForm}
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </TabPanel>
                <TabPanel>
                  <HStack align={"center"} justify={"space-between"} mb={2}>
                    <Heading size={"md"} mb={0}>
                      Questions
                    </Heading>
                    <IconButton
                      onClick={onOpenQuestion}
                      colorScheme={"blue"}
                      icon={<FaPlus />}
                    />
                  </HStack>
                  <Modal
                    size={"lg"}
                    isOpen={isOpenQuestion}
                    onClose={onCloseQuestion}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Create new question</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form>
                          <Stack gap={6}>
                            <FormControl>
                              <FormLabel>Question</FormLabel>
                              <Textarea placeholder="Enter the question here..." />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Options</FormLabel>
                              <Stack>
                                <HStack align={"center"}>
                                  <Text mb={0}>1</Text>
                                  <Input placeholder="Resource title" />
                                </HStack>
                                <HStack align={"center"}>
                                  <Text mb={0}>2</Text>
                                  <Input placeholder="Resource title" />
                                </HStack>
                                <HStack align={"center"}>
                                  <Text mb={0}>3</Text>
                                  <Input placeholder="Resource title" />
                                </HStack>
                                <HStack align={"center"}>
                                  <Text mb={0}>4</Text>
                                  <Input placeholder="Resource title" />
                                </HStack>
                              </Stack>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Correct Option</FormLabel>
                              <Input
                                type={"number"}
                                min={1}
                                max={4}
                                placeholder="Enter the correct option number"
                              />
                            </FormControl>
                          </Stack>
                        </form>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          variant="ghost"
                          mr={3}
                          onClick={onCloseResource}
                        >
                          Close
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  <Stack gap={6}>
                    {questions.map((item, idx) => {
                      return (
                        <Card key={idx} bg={"#171923f0"}>
                          <CardHeader
                            pb={5}
                            display={"flex"}
                            alignItems={"center"}
                            gap={6}
                          >
                            <Heading size="xl" mb={0}>
                              {idx + 1}
                            </Heading>
                            <Text fontSize={"1.2rem"} mb={0}>
                              {item.description}
                            </Text>
                          </CardHeader>

                          <CardBody>
                            <Stack spacing={4}>
                              {item.options.map((option, opt) => {
                                return (
                                  <Box
                                    key={opt}
                                    bg={
                                      option.option === item.correctOption
                                        ? "#07621f"
                                        : undefined
                                    }
                                    p={
                                      option.option === item.correctOption
                                        ? 4
                                        : undefined
                                    }
                                    rounded={"md"}
                                  >
                                    <Text fontSize="sm" mb={0}>
                                      {option.description}
                                    </Text>
                                  </Box>
                                );
                              })}
                            </Stack>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        );

      case Pages.permissions:
        return (
          <div>
            <h2>Permissions</h2>
            <HStack align={"center"} spacing={6} mb={7}>
              <Heading size={"md"} mb={0}>
                Current Owner:
              </Heading>
              <Text mb={0}>{owner}</Text>
            </HStack>
            <Box mb={5}>
              <Heading size={"md"} mb={3}>
                Admins
              </Heading>
              {admins.length ? (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Principal</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {admins.map((admin, index) => (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{admin}</Td>
                          <Td>
                            <HStack justify={"flex-end"}>
                              <IconButton
                                onClick={async (e) => {
                                  await handleDeleteAdmin(Principal.fromText(admin));
                                }}
                                icon={<FiTrash />}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Center>
                  <Text>No admins yet</Text>
                </Center>
              )}
            </Box>
            <HStack align={"stretch"}>
              <input
                type="text"
                placeholder="Enter a valid principal"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
              />
              <Button isLoading={addingNewAdmin} colorScheme="blue" onClick={handleAddAdmin}>Add Admin</Button>
            </HStack>
          </div>
        );

      default:
        return <div>Select a page from the sidebar.</div>;
    }
  };

  return (
    <div className="admin-all">
      {/* <Layout /> */}
      <div className="admin-container">
        <div className="sbar">
          <ul>
            <li onClick={() => setSelectedPage(Pages.courses)}>Courses</li>
            <li onClick={() => setSelectedPage(Pages.permissions)}>
              Permissions
            </li>
          </ul>
          {/* Go Back Button */}
          <button
            className="btn-go-back"
            onClick={() => navigate("/")}
            style={{ position: "absolute", bottom: "20px", left: "20px" }}
          >
            Go Back
          </button>
        </div>
        <div className="content-page">
          <div className="overlay">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

const Page = withAuth(Admin);
export default Page;
